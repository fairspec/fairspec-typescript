import type { ContributorType } from "../../../../models/datacite/common.ts"
import type { Contributor } from "../../../../models/datacite/contributor.ts"
import type { Creator } from "../../../../models/datacite/creator.ts"
import type { Dataset } from "../../../../models/dataset.ts"
import type { FrictionlessContributor } from "../../models/contributor.ts"
import type { FrictionlessPackage } from "../../models/package.ts"
import { convertResourceToFrictionless } from "../resource/toFrictionless.ts"

export function convertDatasetToFrictionless(
  dataset: Dataset,
): FrictionlessPackage {
  const resources = dataset.resources
    ? dataset.resources.map(r => convertResourceToFrictionless(r))
    : []

  const frictionlessPackage: FrictionlessPackage = {
    resources,
  }

  if (dataset.titles && dataset.titles.length > 0) {
    const firstTitle = dataset.titles[0]
    if (firstTitle) {
      frictionlessPackage.title = firstTitle.title
    }
  }

  if (dataset.descriptions && dataset.descriptions.length > 0) {
    const firstDesc = dataset.descriptions[0]
    if (firstDesc) {
      frictionlessPackage.description = firstDesc.description
    }
  }

  if (dataset.version) {
    frictionlessPackage.version = dataset.version
  }

  if (dataset.subjects && dataset.subjects.length > 0) {
    frictionlessPackage.keywords = dataset.subjects.map(s => s.subject)
  }

  if (dataset.dates && dataset.dates.length > 0) {
    const createdDate = dataset.dates.find(d => d.dateType === "Created")
    if (createdDate) {
      frictionlessPackage.created = createdDate.date
    }
  }

  if (dataset.relatedIdentifiers && dataset.relatedIdentifiers.length > 0) {
    const homepage = dataset.relatedIdentifiers.find(
      r => r.relationType === "IsDescribedBy",
    )
    if (homepage) {
      frictionlessPackage.homepage = homepage.relatedIdentifier
    }
  }

  const contributors: FrictionlessContributor[] = []

  if (dataset.creators && dataset.creators.length > 0) {
    for (const creator of dataset.creators) {
      contributors.push(convertCreatorToFrictionlessContributor(creator))
    }
  }

  if (dataset.contributors && dataset.contributors.length > 0) {
    for (const contributor of dataset.contributors) {
      contributors.push(
        convertContributorToFrictionlessContributor(contributor),
      )
    }
  }

  if (contributors.length > 0) {
    frictionlessPackage.contributors = contributors
  }

  if (dataset.rightsList && dataset.rightsList.length > 0) {
    frictionlessPackage.licenses = dataset.rightsList.map(rights => ({
      name: rights.rights,
      path: rights.rightsUri,
    }))
  }

  return frictionlessPackage
}

function convertCreatorToFrictionlessContributor(
  creator: Creator,
): FrictionlessContributor {
  const contributor: FrictionlessContributor = {
    title: creator.name,
    roles: ["creator"],
  }

  if (creator.givenName) {
    contributor.givenName = creator.givenName
  }

  if (creator.familyName) {
    contributor.familyName = creator.familyName
  }

  if (creator.affiliation && creator.affiliation.length > 0) {
    const firstAffiliation = creator.affiliation[0]
    if (firstAffiliation?.name) {
      contributor.organization = firstAffiliation.name
    }
  }

  return contributor
}

function convertContributorToFrictionlessContributor(
  contributor: Contributor,
): FrictionlessContributor {
  const frictionlessContributor: FrictionlessContributor = {
    title: contributor.name,
    roles: [convertContributorTypeToRole(contributor.contributorType)],
  }

  if (contributor.givenName) {
    frictionlessContributor.givenName = contributor.givenName
  }

  if (contributor.familyName) {
    frictionlessContributor.familyName = contributor.familyName
  }

  if (contributor.affiliation && contributor.affiliation.length > 0) {
    const firstAffiliation = contributor.affiliation[0]
    if (firstAffiliation?.name) {
      frictionlessContributor.organization = firstAffiliation.name
    }
  }

  return frictionlessContributor
}

function convertContributorTypeToRole(
  contributorType: ContributorType,
): string {
  switch (contributorType) {
    case "ContactPerson":
      return "contactperson"
    case "DataCollector":
      return "datacollector"
    case "DataCurator":
      return "datacurator"
    case "DataManager":
      return "datamanager"
    case "Distributor":
      return "distributor"
    case "Editor":
      return "editor"
    case "HostingInstitution":
      return "hostinginstitution"
    case "Producer":
      return "producer"
    case "ProjectLeader":
      return "projectleader"
    case "ProjectManager":
      return "projectmanager"
    case "ProjectMember":
      return "projectmember"
    case "RegistrationAgency":
      return "registrationagency"
    case "RegistrationAuthority":
      return "registrationauthority"
    case "RelatedPerson":
      return "relatedperson"
    case "Researcher":
      return "researcher"
    case "ResearchGroup":
      return "researchgroup"
    case "RightsHolder":
      return "rightsholder"
    case "Sponsor":
      return "sponsor"
    case "Supervisor":
      return "supervisor"
    case "Translator":
      return "translator"
    case "WorkPackageLeader":
      return "workpackageleader"
    default:
      return "other"
  }
}
