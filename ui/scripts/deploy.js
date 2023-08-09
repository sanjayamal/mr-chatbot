const child_process = require("node:child_process");
const path = require("node:path");

const stackName =
  process.env.MR_CHATBOT_FRONT_DEPLOY_STACK ?? "mr-chatbot-front-dev";
const profile = process.env.MR_CHATBOT_FRONT_DEPLOY_PROFILE ?? "mrchatbot-sam";

const getCloudFormationOuputValue = (key) => {
  const command = `aws cloudformation describe-stacks --stack-name ${stackName} --no-paginate --no-cli-pager --output text --query "Stacks[0].Outputs[?OutputKey=='${key}'].OutputValue" --profile ${profile}`;
  return child_process.execSync(command);
};

const uploadFiles = () => {
  const sourceDir = path.resolve(path.join(__dirname, "../build"));
  const s3BucketName = getCloudFormationOuputValue("WebAppS3BucketName");

  console.log(s3BucketName);

  console.log(`Uploading files from ${sourceDir} to s3://${s3BucketName}`);
  child_process.execSync(`aws s3 sync ${sourceDir} s3://${s3BucketName}`, {
    stdio: "inherit",
  });
};

const clearCloudFrontCache = () => {
  const distributionId = getCloudFormationOuputValue(
    "CloudFrontDistributionId"
  );
  console.log(`Clearing CloudFront cache for distribution ${distributionId}`);

  const command = `aws cloudfront create-invalidation --no-paginate --no-cli-pager --profile ${profile} --paths "/*" --distribution-id ${distributionId}`;
  child_process.execSync(command, { stdio: "inherit" });
};

// upload files to s3
uploadFiles();
// cloud front cache invalidation
clearCloudFrontCache();

const domain = getCloudFormationOuputValue("WebAppDomain");
console.log(`Deployment done, visit https://${domain}`);
