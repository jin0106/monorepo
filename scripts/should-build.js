const { execSync } = require("child_process");

const branch = process.env.VERCEL_GIT_COMMIT_REF;
const appName = process.env.APP_NAME;

const allowedBranches = ["dev", "staging", "main"];
if (!allowedBranches.includes(branch)) {
  console.log(`🚫 '${branch}' 브랜치는 무시됩니다.`);
  process.exit(0);
}

if (!appName) {
  console.error("❗ APP_NAME 환경 변수가 설정되어 있지 않습니다.");
  process.exit(0);
}

try {

  const affected = execSync(
    `npx nx show projects --affected --base=HEAD^ --plain`,
    { encoding: "utf-8" }
  ).split("\n").filter(Boolean);

  if (!affected.includes(appName)) {
    console.log(`🟡 '${appName}'는 변경되지 않았습니다. Build Skipped.`);
    process.exit(0);
  }

  console.log(`✅ '${appName}' 변경됨. Build 진행.`);
  process.exit(1);

} catch (err) {
  console.error("❗ nx affected 실행 오류 – 빌드 강제 진행", err);
  // 실패 시 빌드를 계속하도록 함
}