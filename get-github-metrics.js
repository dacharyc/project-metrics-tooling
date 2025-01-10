import { Octokit } from "octokit";

async function getGitHubMetrics(owner, repo) {
    const apiToken = process.env.GITHUB_TOKEN
    const octokit = new Octokit({
        auth: apiToken,
    });
    await octokit.rest.users.getAuthenticated();
    const clones = await getRepoClones(octokit, owner, repo);
    const pageViews = await getPageViews(octokit, owner, repo);
    const metricCounts = await getRepoMetricCounts(octokit, owner, repo);
    return {
        date: new Date().toISOString(),
        owner: owner,
        repo: repo,
        clones: clones,
        totalViews: pageViews.viewCount,
        uniqueViews: pageViews.uniqueViews,
        stars: metricCounts.stars,
        forks: metricCounts.forks,
        watchers: metricCounts.watchers,
    }
}

async function getRepoClones(octokit, owner, repo) {
    const clones = await octokit.rest.repos.getClones({
        owner: owner,
        repo: repo
    });
    return clones.data.count;
}

async function getPageViews(octokit, owner, repo) {
    const pageViews = await octokit.rest.repos.getViews({
        owner: owner,
        repo: repo
    });
    return {
        viewCount: pageViews.data.count,
        uniqueViews: pageViews.data.uniques,
    }
}

async function getRepoMetricCounts(octokit, owner, repo) {
    const repoDetails = await octokit.rest.repos.get({
        owner: owner,
        repo: repo
    });
    const stars = repoDetails.data.stargazers_count;
    const forks = repoDetails.data.forks_count;
    const watchers = repoDetails.data.watchers;
    //console.log("Stars: %s, Forks: %s, Watchers: %s", stars, forks, watchers);
    return {
        stars: stars,
        forks: forks,
        watchers: watchers
    }
}

// Currently there is no data to display, so not sure what form the return data takes. Will add details to work with this data once I can get a return value.
async function getMaintenanceInfo(octokit) {
    const codeFrequency = await octokit.rest.repos.getCodeFrequencyStats({
        owner: "mongodb",
        repo: "docs-notebooks"
    });
    const commits = await octokit.rest.repos.getCommitActivityStats({
        owner: "mongodb",
        repo: "docs-notebooks"
    });
    if (codeFrequency.status === 202 || commits.status === 202) {
        console.log("GitHub returned a 202, which means the requested data is not currently cached. Try again later.")
    } else {
        console.log(codeFrequency);
        console.log(commits);
    }
}

export {
    getGitHubMetrics
}
