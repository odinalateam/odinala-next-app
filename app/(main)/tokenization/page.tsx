import { getPublicListings } from "@/lib/actions/public-listings";
import { TokenizationClient } from "@/components/tokenization/tokenization-client";

export default async function TokenizationPage() {
  const listings = await getPublicListings();

  return <TokenizationClient listings={listings} />;
}
