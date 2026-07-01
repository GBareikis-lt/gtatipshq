/**
 * Generate a background image with fal.ai (FLUX). Returns a JPEG/PNG Buffer.
 *
 * Two modes:
 *  - text-to-image (FLUX schnell, cheap ~$0.003): atmospheric scenes for info slides.
 *  - image-to-image (FLUX dev, ~$0.03): generate an ORIGINAL image in the STYLE of
 *    a reference photo you uploaded — e.g. a new GTA-style character for a hero
 *    slide, seeded by your library art. The subject changes; the art style carries.
 *
 * Needs FAL_KEY (https://fal.ai/dashboard/keys).
 */

const TXT2IMG_MODEL = process.env.FAL_MODEL || "fal-ai/flux/schnell";
const IMG2IMG_MODEL = process.env.FAL_IMG2IMG_MODEL || "fal-ai/flux/dev/image-to-image";

export const IMAGE_COST = 0.003; // txt2img (schnell)
export const IMAGE_COST_REF = 0.03; // img2img (dev)

/** Atmospheric anchor for info slides (photographic Vice City). */
export const SCENE_STYLE =
  "cinematic, moody neon lighting, Miami / Vice City sunset aesthetic, synthwave color grade, high detail, photographic, no text, no watermark, no logos, no readable words";

/** GTA VI cover-art anchor for hero slides (illustrated character). */
export const HERO_STYLE =
  "in the style of Grand Theft Auto VI official cover artwork, bold digital illustration, cel-shaded, vibrant saturated colors, dramatic rim lighting, Vice City neon sunset backdrop, cinematic character portrait, ultra detailed, no text, no logos, no watermark";

export async function generateImage(
  scenePrompt,
  { key, size = "landscape_4_3", imageUrl = null, strength = 0.72, styleAnchor = SCENE_STYLE } = {},
) {
  if (!key) throw new Error("FAL_KEY is not set");

  const prompt = `${scenePrompt}. ${styleAnchor}`;
  const img2img = Boolean(imageUrl);
  const model = img2img ? IMG2IMG_MODEL : TXT2IMG_MODEL;

  const body = img2img
    ? { prompt, image_url: imageUrl, strength, num_images: 1, enable_safety_checker: true }
    : {
        prompt,
        image_size: size,
        num_inference_steps: 4,
        num_images: 1,
        enable_safety_checker: true,
      };

  const res = await fetch(`https://fal.run/${model}`, {
    method: "POST",
    headers: { Authorization: `Key ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
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
