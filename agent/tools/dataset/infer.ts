import { Dataset, inferDataset } from "@fairspec/library"
import { createTool } from "@mastra/core/tools"
import { z } from "zod"

export const inferDatasetTool = createTool({
  id: "infer-dataset",
  description:
    "Infer metadata for all resources in a dataset. Analyzes each resource to determine schemas and dialects.",
  inputSchema: z.object({
    dataset: Dataset.describe("The dataset to infer metadata for"),
  }),
  outputSchema: Dataset,
  execute: async input => {
    return await inferDataset(input.dataset)
  },
})
