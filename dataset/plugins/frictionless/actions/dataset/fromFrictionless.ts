import type { Dataset } from "@fairspec/metadata"
import type { FrictionlessContributor } from "../../models/contributor.ts"
import type { FrictionlessPackage } from "../../models/package.ts"
import { convertResourceFromFrictionless } from "../resource/fromFrictionless.ts"

type Creator = NonNullable<Dataset["creators"]>[number]
type Contributor = NonNullable<Dataset["contributors"]>[number]

export function convertDatasetFromFrictionless(
  frictionlessPackage: FrictionlessPackage,
): Dataset {
  const resources = frictionlessPackage.resources.map(r =>
    convertResourceFromFrictionless(r),
  )

  const dataset: Dataset = {
    resources,
  }

  if (frictionlessPackage.title) {
    dataset.titles = [{ title: frictionlessPackage.title }]
  }

  if (frictionlessPackage.description) {
    dataset.descriptions = [
      {
        description: frictionlessPackage.description,
        descriptionType: "Abstract" as const,
      },
    ]
  }

  if (frictionlessPackage.version) {
    dataset.version = frictionlessPackage.version
  }

  if (frictionlessPackage.keywords && frictionlessPackage.keywords.length > 0) {
    dataset.subjects = frictionlessPackage.keywords.map(keyword => ({
      subject: keyword,
    }))
  }

  if (frictionlessPackage.created) {
    dataset.dates = [
      { date: frictionlessPackage.created, dateType: "Created" as const },
    ]
  }

  if (frictionlessPackage.homepage) {
    dataset.relatedIdentifiers = [
      {
        relatedIdentifier: frictionlessPackage.homepage,
        relationType: "IsDescribedBy" as const,
        relatedIdentifierType: "URL" as const,
      },
    ]
  }

  if (frictionlessPackage.contributors) {
    const creators = frictionlessPackage.contributors
      .filter(c => c.roles?.some(role => role.toLowerCase() === "creator"))
      .map(convertFrictionlessContributorToCreator)

    if (creators.length > 0) {
      dataset.creators = creators
    }

    const contributors = frictionlessPackage.contributors
      .filter(c => !c.roles?.some(role => role.toLowerCase() === "creator"))
      .map(convertContributor)

    if (contributors.length > 0) {
      dataset.contributors = contributors
    }
  }

  if (frictionlessPackage.licenses && frictionlessPackage.licenses.length > 0) {
    dataset.rightsList = frictionlessPackage.licenses.map(license => ({
      rights: license.name ?? license.title,
      rightsUri: license.path,
    }))
  }

  return dataset
}

function convertFrictionlessContributorToCreator(
  contributor: FrictionlessContributor,
): Creator {
  const name =
    contributor.title ??
    (contributor.givenName && contributor.familyName
      ? `${contributor.givenName} ${contributor.familyName}`
      : (contributor.givenName ?? contributor.familyName ?? "Unknown"))

  const creator: Creator = {
    name,
  }

  if (contributor.givenName) {
    creator.givenName = contributor.givenName
  }

  if (contributor.familyName) {
    creator.familyName = contributor.familyName
  }

  if (contributor.organization) {
    creator.affiliation = [{ name: contributor.organization }]
  }

  return creator
}

function convertContributor(contributor: FrictionlessContributor): Contributor {
  const creator = convertFrictionlessContributorToCreator(contributor)

  const nonCreatorRoles = contributor.roles?.filter(
    role => role.toLowerCase() !== "creator",
  )
  const contributorType =
    nonCreatorRoles && nonCreatorRoles.length > 0 && nonCreatorRoles[0]
      ? convertContributorType(nonCreatorRoles[0])
      : "Other"

  return {
    ...creator,
    contributorType,
  }
}

function convertContributorType(role: string): Contributor["contributorType"] {
  const lowerRole = role.toLowerCase()
  switch (lowerRole) {
    case "contact":
    case "contactperson":
      return "ContactPerson"
    case "datacollector":
      return "DataCollector"
    case "datacurator":
      return "DataCurator"
    case "datamanager":
      return "DataManager"
    case "distributor":
      return "Distributor"
    case "editor":
      return "Editor"
    case "hostinginstitution":
      return "HostingInstitution"
    case "producer":
      return "Producer"
    case "projectleader":
      return "ProjectLeader"
    case "projectmanager":
      return "ProjectManager"
    case "projectmember":
      return "ProjectMember"
    case "registrationagency":
      return "RegistrationAgency"
    case "registrationauthority":
      return "RegistrationAuthority"
    case "relatedperson":
      return "RelatedPerson"
    case "researcher":
      return "Researcher"
    case "researchgroup":
      return "ResearchGroup"
    case "rightsholder":
      return "RightsHolder"
    case "sponsor":
      return "Sponsor"
    case "supervisor":
      return "Supervisor"
    case "translator":
      return "Translator"
    case "workpackageleader":
      return "WorkPackageLeader"
    default:
      return "Other"
  }
}
