import { AIToolRecommendationCard } from "@/components/ai-tool-recommendation-card";
import type { TaskRecommendation } from "@/lib/content/ai-tool-recommendations";

export function AIToolRecommendations({
  recommendations,
}: {
  recommendations: TaskRecommendation[];
}) {
  return (
    <div className="grid items-start gap-3 sm:grid-cols-2">
      {recommendations.map((rec, i) => (
        <AIToolRecommendationCard key={rec.slug} rec={rec} index={i} />
      ))}
    </div>
  );
}
