"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";

export function TabsExample() {
  return (
    <Tabs defaultValue="react" className="w-full max-w-lg">
      <TabsList>
        <TabsTrigger value="react">React</TabsTrigger>
        <TabsTrigger value="blade">Blade</TabsTrigger>
      </TabsList>
      <TabsContent value="react" className="rounded-lg border p-4">React source</TabsContent>
      <TabsContent value="blade" className="rounded-lg border p-4">Blade source</TabsContent>
    </Tabs>
  );
}
