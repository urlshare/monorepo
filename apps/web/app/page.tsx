import { Button } from "@workspace/ui/components/button";

export default async function Page() {
  return (
    <div>
      <main>
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold">Hello World</h1>
            <Button size="sm">Button</Button>
          </div>
        </div>
      </main>
    </div>
  );
}
