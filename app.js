async function generateTerraform() {

    const prompt =
        document.getElementById("prompt").value.trim();

    const status =
        document.getElementById("status");

    const filesContainer =
        document.getElementById("files-container");

    const downloadButton =
        document.getElementById("download-btn");


    if (!prompt) {

        alert("Please enter your infrastructure requirement.");

        return;
    }


    status.innerHTML =
        "<div class='loading'>🤖 Generating Terraform project...</div>";

    filesContainer.innerHTML = "";

    downloadButton.style.display = "none";


    const systemPrompt = `

You are an expert AWS Cloud Architect,
Terraform Engineer and DevOps Engineer.

The user will describe an AWS infrastructure requirement.

Your job is to generate a COMPLETE Terraform project.

IMPORTANT:

Return ONLY valid JSON.

Do NOT return markdown.

Do NOT return triple backticks.

Do NOT write explanations outside JSON.

The JSON must have exactly this structure:

{
  "provider.tf": "complete Terraform code",
  "variables.tf": "complete Terraform code",
  "main.tf": "complete Terraform code",
  "outputs.tf": "complete Terraform code",
  "terraform.tfvars.example": "complete Terraform variable example",
  "README.md": "complete README documentation"
}

Rules:

1. Generate valid Terraform HCL.

2. Use the AWS provider.

3. Use variables wherever appropriate.

4. Never generate AWS access keys.

5. Never generate secrets.

6. Never hard-code credentials.

7. Use Terraform resource references.

8. Create all required dependencies.

9. Include useful outputs.

10. Include comments for important Terraform resources.

11. Use sensible AWS defaults.

12. If an AMI is required, make it a variable.

13. If an EC2 key pair is required, make it a variable.

14. If networking is required, create the necessary
    VPC, subnets, route tables, Internet Gateway,
    NAT Gateway and security groups.

15. Use appropriate CIDR ranges.

16. Use least-privilege security group rules.

17. The project must be deployable with:

terraform init

terraform validate

terraform plan

terraform apply

18. README.md must explain:

- Project architecture
- Prerequisites
- terraform init
- terraform validate
- terraform plan
- terraform apply
- terraform destroy

19. terraform.tfvars.example must contain
    example values but MUST NOT contain secrets.

20. Every file must contain complete content.

USER REQUIREMENT:

${prompt}

`;


    try {

        const response = await fetch(
            "/api/generate",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    model: "qwen2.5-coder:3b",

                    prompt: systemPrompt,

                    stream: false,

                    format: "json",

                    options: {
                        temperature: 0.1
                    }

                })
            }
        );


        if (!response.ok) {

            throw new Error(
                "Ollama HTTP error: " +
                response.status
            );
        }


        const data =
            await response.json();


        let project;


        try {

            project =
                JSON.parse(data.response);

        } catch (parseError) {

            throw new Error(
                "Ollama returned invalid JSON."
            );
        }


        const expectedFiles = [

            "provider.tf",

            "variables.tf",

            "main.tf",

            "outputs.tf",

            "terraform.tfvars.example",

            "README.md"

        ];


        const missingFiles =
            expectedFiles.filter(
                file => !project[file]
            );


        if (missingFiles.length > 0) {

            throw new Error(
                "Missing files: " +
                missingFiles.join(", ")
            );
        }


        window.generatedTerraformProject =
            project;


        displayFiles(project);


        status.innerHTML =
            "<div class='success'>✓ Terraform project generated successfully.</div>";

        downloadButton.style.display =
            "inline-block";


    } catch (error) {

        status.innerHTML = "";

        filesContainer.innerHTML =

            `<div class="error">
                ${escapeHtml(error.message)}
             </div>`;

    }
}


function displayFiles(project) {

    const container =
        document.getElementById("files-container");


    container.innerHTML = "";


    Object.entries(project).forEach(
        ([filename, content]) => {

            const fileCard =
                document.createElement("div");

            fileCard.className =
                "file-card";


            fileCard.innerHTML = `

                <div class="file-header">

                    <span>📄 ${escapeHtml(filename)}</span>

                    <button
                        class="small-button"
                        onclick="downloadFile(
                            '${escapeHtml(filename)}'
                        )">

                        Download

                    </button>

                </div>

                <pre><code>${escapeHtml(content)}</code></pre>

            `;


            container.appendChild(fileCard);

        }
    );
}


function downloadFile(filename) {

    const project =
        window.generatedTerraformProject;


    const content =
        project[filename];


    const blob =
        new Blob(
            [content],
            {
                type: "text/plain"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;

    link.download = filename;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}


async function downloadZip() {

    const project =
        window.generatedTerraformProject;


    if (!project) {

        alert("Generate a project first.");

        return;
    }


    const zip =
        new JSZip();


    Object.entries(project).forEach(
        ([filename, content]) => {

            zip.file(
                filename,
                content
            );

        }
    );


    const blob =
        await zip.generateAsync(
            {
                type: "blob"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;

    link.download =
        "terraform-project.zip";


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}


function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
