
async function generateTerraform() {

    const prompt =
        document.getElementById("prompt").value;

    const result =
        document.getElementById("result");

    const status =
        document.getElementById("status");


    if (!prompt.trim()) {

        alert("Please enter your infrastructure requirement.");

        return;

    }


    status.innerHTML =
        "<div class='loading'>Generating Terraform...</div>";

    result.textContent = "";


    const systemPrompt = `

You are an expert AWS Cloud Engineer,
Terraform Engineer and DevOps Engineer.

Your task is to generate complete,
production-quality Terraform configuration.

The user will describe AWS infrastructure.

Generate these files:

========================

provider.tf

variables.tf

main.tf

outputs.tf

terraform.tfvars.example

README.md

========================


Rules:

1. Use Terraform HCL.

2. Use the AWS provider.

3. Use variables wherever appropriate.

4. Never hard-code AWS credentials.

5. Never generate AWS access keys.

6. Create all required dependencies.

7. Use resource references instead of hard-coded IDs.

8. Include useful outputs.

9. Include comments explaining important resources.

10. Make the Terraform configuration valid.

11. Include networking resources when required.

12. Use sensible CIDR blocks.

13. Use security groups with least-privilege rules.

14. Clearly separate variables from resources.

15. Generate complete code.

16. Do not omit required resources.

17. Explain how to deploy the generated Terraform.

18. If a service requires an AMI ID,
    make it a variable.

19. If a resource requires a key pair,
    make it a variable.

20. Do not create fake AWS resource IDs.

Return the complete Terraform project.

USER REQUIREMENT:

${prompt}

`;


    try {


        const response = await fetch(
            "/api/generate",
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify({

                    model:
                        "qwen2.5-coder:3b",

                    prompt:
                        systemPrompt,

                    stream:
                        false,

                    options: {

                        temperature:
                            0.1

                    }

                })

            }
        );


        if (!response.ok) {

            throw new Error(
                "Ollama HTTP error: "
                + response.status
            );

        }


        const data =
            await response.json();


        status.innerHTML = "";


        result.textContent =
            data.response;


    }

    catch (error) {

        status.innerHTML = "";

        result.textContent =
            "Error: "
            + error.message;

    }

}

