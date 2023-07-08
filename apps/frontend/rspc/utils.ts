import { QueryClient } from "@tanstack/react-query";
import { createClient } from "@rspc/client";
import { createReactQueryHooks } from "@rspc/react";

import type { Procedures } from "./bindings";
import { FetchTransport } from "./transport";

const client = createClient<Procedures>({
  transport: new FetchTransport(`${process.env.NEXT_PUBLIC_API_URL}/rspc`),
});

const queryClient = new QueryClient();
const rspc = createReactQueryHooks<Procedures>();

export { client, queryClient, rspc };
