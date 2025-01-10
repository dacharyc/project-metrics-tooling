import {
    getGitHubMetrics
} from "./get-github-metrics.js";
import { addMetricsToAtlas } from "./write-to-db.js";

const metricsDoc = await getGitHubMetrics("mongodb", "docs-notebooks");
await addMetricsToAtlas(metricsDoc);
