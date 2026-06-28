import { neon } from "@neondatabase/serverless";

let client: ReturnType<typeof neon> | null = null;

function getClient() {
  if (!client) {
    client = neon(process.env.DATABASE_URL!);
  }
  return client;
}

export function sql(strings: TemplateStringsArray, ...values: unknown[]): Promise<any[]> {
  return getClient()(strings, ...values) as Promise<any[]>;
}
