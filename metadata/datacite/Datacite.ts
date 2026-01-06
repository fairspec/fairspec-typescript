import { z } from "zod"
import { AlternateIdentifiers } from "./AlternateIdentifier.ts"
import { ContentTypes } from "./ContentType.ts"
import { Contributors } from "./Contributor.ts"
import { Creators } from "./Creator.ts"
import { Dates } from "./Date.ts"
import { Descriptions } from "./Description.ts"
import { Formats } from "./Formats.ts"
import { FundingReferences } from "./FundingReference.ts"
import { GeoLocations } from "./GeoLocation.ts"
import { Doi, DoiPrefix, DoiSuffix } from "./Identifier.ts"
import { Language } from "./Language.ts"
import { PublicationYear } from "./PublicationYear.ts"
import { Publisher } from "./Publisher.ts"
import { RelatedIdentifiers } from "./RelatedIdentifier.ts"
import { RelatedItems } from "./RelatedItem.ts"
import { RightsList } from "./Rights.ts"
import { Sizes } from "./Size.ts"
import { Subjects } from "./Subject.ts"
import { Titles } from "./Title.ts"
import { Version } from "./Version.ts"

export const Datacite = z.object({
  doi: Doi.optional().describe(
    "The Digital Object Identifier (DOI) for the resource",
  ),
  prefix: DoiPrefix.optional().describe("The DOI prefix for the resource"),
  suffix: DoiSuffix.optional().describe("The DOI suffix for the resource"),
  creators: Creators.optional().describe(
    "The main researchers involved in producing the data, or the authors of the publication",
  ),
  titles: Titles.optional().describe(
    "A name or title by which a resource is known",
  ),
  publisher: Publisher.optional().describe(
    "The entity that holds, archives, publishes, prints, distributes, releases, issues, or produces the resource",
  ),
  publicationYear: PublicationYear.optional().describe(
    "The year when the data was or will be made publicly available",
  ),
  subjects: Subjects.optional().describe(
    "Subject, keywords, classification codes, or key phrases describing the resource",
  ),
  contributors: Contributors.optional().describe(
    "The institution or person responsible for collecting, managing, distributing, or otherwise contributing to the development of the resource",
  ),
  dates: Dates.optional().describe("Different dates relevant to the work"),
  language: Language.optional().describe(
    "The primary language of the resource",
  ),
  types: ContentTypes.optional().describe("The type of the resource"),
  alternateIdentifiers: AlternateIdentifiers.optional().describe(
    "An identifier or identifiers other than the primary Identifier applied to the resource",
  ),
  relatedIdentifiers: RelatedIdentifiers.optional().describe(
    "Identifiers of related resources",
  ),
  sizes: Sizes.optional().describe("Size information about the resource"),
  formats: Formats.optional().describe("Technical format of the resource"),
  version: Version.optional().describe("The version number of the resource"),
  rightsList: RightsList.optional().describe(
    "Rights information for this resource",
  ),
  descriptions: Descriptions.optional().describe(
    "All additional information that does not fit in any of the other categories",
  ),
  geoLocations: GeoLocations.optional().describe(
    "Spatial region or named place where the data was gathered or about which the data is focused",
  ),
  fundingReferences: FundingReferences.optional().describe(
    "Information about financial support (funding) for the resource",
  ),
  relatedItems: RelatedItems.optional().describe(
    "Information about resources related to the one being registered",
  ),
})

export type DataCite = z.infer<typeof DataCite>
