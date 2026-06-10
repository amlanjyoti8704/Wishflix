import { testRedis } from "@/services/test-redis";

export default async function Page() {
  const value = await testRedis();

  return (
    <div>
      Redis Value: {String(value)}
    </div>
  );
}