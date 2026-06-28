export async function fetchCopa2026(signal?: AbortSignal) {
  const response = await fetch(
    "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json",
    { signal },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  return response.json() as Promise<import("../types").CopaData>;
}
