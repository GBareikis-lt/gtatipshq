/**
 * Generate a background image with fal.ai (FLUX). Returns a JPEG/PNG Buffer.
 *
 * Needs FAL_KEY (get one free at https://fal.ai/dashboard/keys). FLUX schnell is
 * fast and cheap (~$0.003/image). Each slide gets its own prompt, so a carousel
 * is visually varied instead of a flat gradient.
 */

const DEFAULT_MODEL = process.env.FAL_MODEL || "fal-ai/flux/schnell";

// Style anchor appended to every prompt for a cohesive Vice City / GTA look.
const STYLE =
  "cinematic, moody neon lighting, Miami / Vice City sunset aesthetic, synthwave color grade, high detail, photographic, no text, no watermark, no logos, no readable words";

/** Rough per-image cost estimate (USD) for budget tracking. */
export const IMAGE_COST = 0.003;

export async function generateImage(scenePrompt, { key, model = DEFAULT_MODEL, size = "landscape_4_3" } = {}) {
  if (!key) throw new Error("FAL_KEY is not set");

  const prompt = `${scenePrompt}. ${STYLE}`;
  const res = await fetch(`https://fal.run/${model}`, {
    method: "POST",
    headers: {
      Authorization: `Key ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      image_size: size,
      num_inference_steps: 4,
      num_images: 1,
      enable_safety_checker: true,
    }),
  });

  if (!res.ok) {
    throw new Error(`fal.ai ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }

  const data = await res.json();
  const url = data?.images?.[0]?.url;
  if (!url) throw new Error("fal.ai returned no image URL");

  const imgRes = await fetch(url);
  if (!imgRes.ok) throw new Error(`Failed to download image: ${imgRes.status}`);
  return Buffer.from(await imgRes.arrayBuffer());
}
