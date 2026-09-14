import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const client = new SecretsManagerClient({ region: process.env.AWS_REGION });

export async function loadSecretsIfProduction(): Promise<void> {
    if (process.env.NODE_ENV !== "production") return;

    const secretName = process.env.AUTH_SECRET_NAME;
    if (!secretName) throw new Error("AUTH_SECRET_NAME env var is required in production");

    const response = await client.send(new GetSecretValueCommand({
        SecretId: secretName
    }));
    if (!response.SecretString) throw new Error(`Secret $${secretName} has no string value`);

    const secrets = JSON.parse(response.SecretString) as Record<string, string>;
    Object.assign(process.env, secrets);
}