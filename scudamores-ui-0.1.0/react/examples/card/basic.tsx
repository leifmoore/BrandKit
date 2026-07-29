import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

export function CardExample() {
  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Weekly summary</CardTitle>
        <CardDescription>Activity for the last seven days.</CardDescription>
      </CardHeader>
      <CardContent><p className="text-3xl font-medium">128</p></CardContent>
      <CardFooter><Button variant="outline">View report</Button></CardFooter>
    </Card>
  );
}
