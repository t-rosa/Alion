import { Link } from "@tanstack/react-router";
import { buttonVariants } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";

export function NotFoundScreen() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <Card className="min-w-96">
        <CardHeader>
          <CardTitle>Page non trouvé</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Désolé, la page n&apos;existe pas.</p>
        </CardContent>
        <CardFooter className="grid gap-3">
          <Link className={buttonVariants()} to="..">
            &larr; Retour
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
