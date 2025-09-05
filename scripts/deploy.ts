import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

interface VersionBump {
    type: 'major' | 'minor' | 'patch';
    description: string;
}

class DeploymentManager {
    private packageJsonPath = path.join(process.cwd(), 'package.json');
    private changelogPath = path.join(process.cwd(), 'CHANGELOG.md');
    private readmePath = path.join(process.cwd(), 'README.md');

    async deploy(versionBump: VersionBump, changes: string[]): Promise<void> {
        console.log('🚀 Starting deployment process...\n');

        try {
            // 1. Update version
            const newVersion = this.updateVersion(versionBump.type);
            console.log(`📊 Version updated: ${newVersion}`);

            // 2. Update changelog
            this.updateChangelog(newVersion, changes, versionBump.type);
            console.log('📝 Changelog updated');

            // 3. Update README
            this.updateReadme(versionBump.description);
            console.log('📖 README updated');

            // 4. Commit changes
            this.commitChanges(newVersion, versionBump.description, versionBump.type);
            console.log('💾 Changes committed');

            // 5. Create tag (if not patch)
            if (versionBump.type !== 'patch') {
                this.createTag(newVersion, versionBump.description);
                console.log('🏷️  Tag created');
            }

            // 6. Push to GitHub
            this.pushToGitHub(versionBump.type !== 'patch');
            console.log('📤 Pushed to GitHub');

            console.log('\n✅ Deployment completed successfully!');
            console.log(`🎉 Version ${newVersion} is now live`);
        } catch (error) {
            console.error('❌ Deployment failed:', error);
            process.exit(1);
        }
    }

    private updateVersion(type: 'major' | 'minor' | 'patch'): string {
        const packageJson = JSON.parse(fs.readFileSync(this.packageJsonPath, 'utf8'));
        const [major, minor, patch] = packageJson.version.split('.').map(Number);

        let newVersion: string;
        switch (type) {
            case 'major':
                newVersion = `${major + 1}.0.0`;
                break;
            case 'minor':
                newVersion = `${major}.${minor + 1}.0`;
                break;
            case 'patch':
                newVersion = `${major}.${minor}.${patch + 1}`;
                break;
        }

        packageJson.version = newVersion;
        fs.writeFileSync(this.packageJsonPath, JSON.stringify(packageJson, null, 4));

        return newVersion;
    }

    private updateChangelog(version: string, changes: string[], type: string): void {
        const date = new Date().toISOString().split('T')[0];
        const changelogEntry = this.generateChangelogEntry(version, date, changes, type);

        let changelog = fs.readFileSync(this.changelogPath, 'utf8');

        // Insert after the first line (assuming "# Changelog")
        const lines = changelog.split('\n');
        lines.splice(2, 0, '', changelogEntry);

        fs.writeFileSync(this.changelogPath, lines.join('\n'));
    }

    private generateChangelogEntry(
        version: string,
        date: string,
        changes: string[],
        type: string
    ): string {
        let entry = `## [${version}] - ${date}\n`;

        if (type === 'major') {
            entry += '\n### 🚨 Breaking Changes\n';
            entry += changes
                .filter((c) => c.startsWith('BREAKING:'))
                .map((c) => `- ${c.replace('BREAKING:', '')}`)
                .join('\n');
            entry += '\n\n### Added\n';
            entry += changes
                .filter((c) => c.startsWith('ADD:'))
                .map((c) => `- ${c.replace('ADD:', '')}`)
                .join('\n');
        } else if (type === 'minor') {
            entry += '\n### Added\n';
            entry += changes
                .filter((c) => c.startsWith('ADD:'))
                .map((c) => `- ${c.replace('ADD:', '')}`)
                .join('\n');
            entry += '\n\n### Changed\n';
            entry += changes
                .filter((c) => c.startsWith('CHANGE:'))
                .map((c) => `- ${c.replace('CHANGE:', '')}`)
                .join('\n');
        } else {
            entry += '\n### Fixed\n';
            entry += changes
                .filter((c) => c.startsWith('FIX:'))
                .map((c) => `- ${c.replace('FIX:', '')}`)
                .join('\n');
        }

        return entry;
    }

    private updateReadme(description: string): void {
        let readme = fs.readFileSync(this.readmePath, 'utf8');

        // Find and replace the "Recent Changes" section
        const recentChangesRegex =
            /(## 🔄 Recent Changes|## Recent Changes)([\s\S]*?)(?=\n## |\n# |$)/;
        const newSection = `## 🔄 Recent Changes\n\n${description}\n`;

        if (recentChangesRegex.test(readme)) {
            readme = readme.replace(recentChangesRegex, newSection);
        } else {
            // If no recent changes section exists, add it after the description
            const lines = readme.split('\n');
            const insertIndex = lines.findIndex((line) => line.startsWith('## ')) || 10;
            lines.splice(insertIndex, 0, '', newSection);
            readme = lines.join('\n');
        }

        fs.writeFileSync(this.readmePath, readme);
    }

    private commitChanges(
        version: string,
        description: string,
        type: 'major' | 'minor' | 'patch'
    ): void {
        let commitType: string;

        switch (type) {
            case 'major':
                commitType = 'feat!:'; // Breaking change
                break;
            case 'minor':
                commitType = 'feat:'; // New feature
                break;
            case 'patch':
                commitType = 'fix:'; // Bug fix
                break;
        }

        execSync('git add .', { stdio: 'inherit' });
        execSync(`git commit -m "${commitType} ${description} (v${version})"`, {
            stdio: 'inherit',
        });
    }

    private createTag(version: string, description: string): void {
        execSync(`git tag -a v${version} -m "Release v${version}: ${description}"`, {
            stdio: 'inherit',
        });
    }

    private pushToGitHub(includeTags: boolean): void {
        execSync('git push origin main', { stdio: 'inherit' });
        if (includeTags) {
            execSync('git push origin --tags', { stdio: 'inherit' });
        }
    }
}

// CLI usage
if (require.main === module) {
    const args = process.argv.slice(2);
    if (args.length < 3) {
        console.log(
            'Usage: tsx scripts/deploy.ts <major|minor|patch> "<description>" "<change1>" "<change2>" ...'
        );
        process.exit(1);
    }

    const [type, description, ...changes] = args;
    const deployer = new DeploymentManager();

    deployer.deploy({ type: type as 'major' | 'minor' | 'patch', description }, changes);
}

export default DeploymentManager;
