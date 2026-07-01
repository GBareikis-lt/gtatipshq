/**
 * Generate a background image with fal.ai (FLUX). Returns a JPEG/PNG Buffer.
 *
 * Models:
 *  - info scenes: FLUX schnell (fast, ~$0.003) via text-to-image.
 *  - hero characters: FLUX dev (higher quality, ~$0.025) via text-to-image.
 *  - hero with --ref: FLUX dev image-to-image (~$0.03), style-seeded by your art.
 *
 * Needs FAL_KEY (https://fal.ai/dashboard/keys).
 */

const TXT2IMG_MODEL = process.env.FAL_MODEL || "fal-ai/flux/schnell";
const IMG2IMG_MODEL = process.env.FAL_IMG2IMG_MODEL || "fal-ai/flux/dev/image-to-image";
export const HERO_MODEL = process.env.FAL_HERO_MODEL || "fal-ai/flux/dev";

export const IMAGE_COST = 0.003; // info scene (schnell)
export const IMAGE_COST_HERO = 0.025; // hero character (dev txt2img)
export const IMAGE_COST_REF = 0.03; // hero styled from your art (dev img2img)

const NO_TEXT = "Absolutely no text, no signs, no billboards, no letters, no numbers, no watermark, no logos.";

/** Atmospheric anchor for info slides (photographic Vice City). */
export const SCENE_STYLE =
  `cinematic, moody neon lighting, Miami / Vice City sunset aesthetic, synthwave color grade, photorealistic, high detail, sharp focus, clean composition. ${NO_TEXT}`;

/** GTA VI cover-art anchor for hero slides (illustrated character). */
export const HERO_STYLE =
  `in the style of Grand Theft Auto VI official cover artwork, bold digital illustration, cel-shaded, vibrant saturated colors, dramatic rim lighting, Vice City neon sunset backdrop, cinematic character portrait, detailed realistic face, correct anatomy, sharp focus, ultra detailed. ${NO_TEXT}`;

export async function generateImage(
  scenePrompt,
  { key, size = "landscape_4_3", imageUrl = null, strength = 0.85, styleAnchor = SCENE_STYLE, model = null } = {},
) {
  if (!key) throw new Error("FAL_KEY is not set");

  const prompt = `${scenePrompt}. ${styleAnchor}`;
  const img2img = Boolean(imageUrl);
  const useModel = model || (img2img ? IMG2IMG_MODEL : TXT2IMG_MODEL);
  const steps = useModel.includes("schnell") ? 4 : 28;

  const body = img2img
    ? { prompt, image_url: imageUrl, strength, num_images: 1, enable_safety_checker: true }
    : {
        prompt,
        image_size: size,
        num_inference_steps: steps,
        num_images: 1,
        enable_safety_checker: true,
      };

  const res = await fetch(`https://fal.run/${useModel}`, {
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
