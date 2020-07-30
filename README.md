[![New Relic One Catalog Project header](https://github.com/newrelic/open-source-office/raw/master/examples/categories/images/New_Relic_One_Catalog_Project.png)](https://github.com/newrelic/open-source-office/blob/master/examples/categories/index.md#nr1-catalog)

# Integrations Manager (nr1-integrations-manager)

#### Formly Flex Manager

![CI](https://github.com/newrelic/nr1-integrations-manager/workflows/CI/badge.svg) ![GitHub release (latest SemVer including pre-releases)](https://img.shields.io/github/v/release/newrelic/nr1-integrations-manager?include_prereleases&sort=semver) [![Snyk](https://snyk.io/test/github/newrelic/nr1-flex-manager/badge.svg)](https://snyk.io/test/github/newrelic/nr1-integrations-manager)

## Usage

Use the Integrations Manager to simplify the work of deploying first class product integrations, and developing and deploying new integrations that are built using [`Flex`](https://github.com/newrelic/nri-flex).

> _Flex is an agnostic, all-in-one integration that makes sending data to New Relic from third party sources easier than ever._

![Screenshot](./catalog/screenshots/nr1-integrations-manager-1.png)

## Open Source License

This project is distributed under the [Apache 2 license](LICENSE).

## Dependencies

Requires [`New Relic Infrastructure`](https://newrelic.com/products/infrastructure).

## Getting started

First, ensure that you have [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and [NPM](https://www.npmjs.com/get-npm) installed. If you're unsure whether you have one or both of them installed, run the following command(s) (If you have them installed these commands will return a version number, if not, the commands won't be recognized):

```bash
git --version
npm -v
```

Next, clone this repository and run the following scripts:

```bash
nr1 nerdpack:clone -r https://github.com/newrelic/nr1-integrations-manager.git
cd nr1-integrations-manager
nr1 nerdpack:uuid -gf
npm install
npm start
```

Visit [https://one.newrelic.com/?nerdpacks=local](https://one.newrelic.com/?nerdpacks=local), navigate to the Nerdpack, and :sparkles:

## Deploying this Nerdpack

Open a command prompt in the nerdpack's directory and run the following commands.

```bash
# this is to create a new uuid for the nerdpack so that you can deploy it to your account
nr1 nerdpack:uuid -g [--profile=your_profile_name]
# to see a list of APIkeys / profiles available in your development environment, run nr1 credentials:list
nr1 nerdpack:publish [--profile=your_profile_name]
nr1 nerdpack:deploy [-c [DEV|BETA|STABLE]] [--profile=your_profile_name]
nr1 nerdpack:subscribe [-c [DEV|BETA|STABLE]] [--profile=your_profile_name]
```

Visit [https://one.newrelic.com](https://one.newrelic.com), navigate to the Nerdpack, and :sparkles:

## Community Support

New Relic hosts and moderates an online forum where you can interact with New Relic employees as well as other customers to get help and share best practices. Like all New Relic open source community projects, there's a related topic in the New Relic Explorers Hub. You can find this project's topic/threads here:

[https://discuss.newrelic.com/t/flex-manager-nerdpack/83346](https://discuss.newrelic.com/t/flex-manager-nerdpack/83346)

Please do not report issues with Flex Manager to New Relic Global Technical Support. Instead, visit the [`Explorers Hub`](https://discuss.newrelic.com/c/build-on-new-relic) for troubleshooting and best-practices.

## Issues / Enhancement Requests

Issues and enhancement requests can be submitted in the [Issues tab of this repository](../../issues). Please search for and review the existing open issues before submitting a new issue.

## Contributing

Contributions are welcome (and if you submit a Enhancement Request, expect to be invited to contribute it yourself :grin:). Please review our [Contributors Guide](CONTRIBUTING.md).

Keep in mind that when you submit your pull request, you'll need to sign the CLA via the click-through using CLA-Assistant. If you'd like to execute our corporate CLA, or if you have any questions, please drop us an email at opensource@newrelic.com.
