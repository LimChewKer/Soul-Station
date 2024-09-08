const resources = [
            {
                name: "National Suicide Prevention Lifeline",
                description: "24/7, free and confidential support for people in distress.",
                phone: "1-800-273-8255",
                website: "https://suicidepreventionlifeline.org/"
            },
            {
                name: "Crisis Text Line",
                description: "Text HOME to 741741 to connect with a Crisis Counselor.",
                phone: "Text HOME to 741741",
                website: "https://www.crisistextline.org/"
            },
            {
                name: "SAMHSA's National Helpline",
                description: "Treatment referral and information service (in English and Spanish).",
                phone: "1-800-662-4357",
                website: "https://www.samhsa.gov/find-help/national-helpline"
            }
        ];

        function displayResources() {
            const resourceList = document.getElementById('resourceList');
            resources.forEach(resource => {
                const li = document.createElement('li');
                li.className = 'resource-item';
                li.innerHTML = `
                    <h3>${resource.name}</h3>
                    <p>${resource.description}</p>
                    <p>Phone: ${resource.phone}</p>
                    <p>Website: <a href="${resource.website}" target="_blank">${resource.website}</a></p>
                `;
                resourceList.appendChild(li);
            });
        }

        // Call the function to display resources when the page loads
        window.onload = displayResources;