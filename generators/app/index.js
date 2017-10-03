const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const path = require('path');
const mkdirp = require('mkdirp');

module.exports = class extends Generator {
    prompting() {
        // Have Yeoman greet the user.
        this.log(
            yosay(
                `Welcome to the ${chalk.yellow.bold('World of Warcraft')} addon generator!`
            )
        );

        this.log(
            chalk.red.bold(
                `\nIf you want to be able to run the addon right away please make sure you are in the ${chalk.cyan.underline(
                    '/interface/addons/'
                )} folder!\n`
            )
        );

        const prompts = [
            {
                type: 'input',
                name: 'appName',
                message: 'What is the name of the addon?',
                default: path.basename(process.cwd()),
                required: true
            },
            {
                type: 'input',
                name: 'appDesc',
                message: 'Description of addon?',
                required: true
            },
            {
                type: 'input',
                name: 'wowVersion',
                message: 'What is the latest supported WoW patch version?',
                default: '70300',
                required: true
            },
            {
                type: 'input',
                name: 'authorName',
                message: "What is the author's name?",
                store: true
            },
            {
                type: 'input',
                name: 'authorEmail',
                message: "What is the author's email address?",
                store: true
            },
            {
                type: 'input',
                name: 'appURL',
                message: 'What is the URL for the addon?'
            },
            {
                type: 'input',
                name: 'appFeedback',
                message: 'What is the URL for addon feedback?'
            },
            {
                type: 'input',
                name: 'chatCmd',
                message: `What is the chat command you want to use for the addon?
                    \n> ${chalk.yellow('(without slash)')}`
            },
            {
                type: 'input',
                name: 'iconPath',
                message: `What is the URL for addon feedback?
                    \n> ${chalk.yellow('(without the file extension)')}`,
                default: 'icon'
            }
        ];

        return this.prompt(prompts).then(props => {
            // To access props later use this.props.someAnswer;
            this.props = props;
        });
    }

    default() {
        if (path.basename(this.destinationPath()) !== this.props.appName) {
            this.log(
                `Your generator must be inside a folder named ${this.props.appName}\n` +
                    `I'll automatically create this folder.`
            );
            mkdirp(this.props.appName);
            this.destinationRoot(this.destinationPath(this.props.appName));
        }
    }

    writing() {
        // Libs
        this.fs.copy(this.templatePath('libs/**'), this.destinationPath('libs/'));

        // Locales
        this.fs.copyTpl(
            this.templatePath('locales/**'),
            this.destinationPath('locales/'),
            {
                appName: this.props.appName
            }
        );

        // Modules
        this.fs.copyTpl(
            this.templatePath('modules/**'),
            this.destinationPath('modules/'),
            {
                appName: this.props.appName
            }
        );

        // .pkgmeta
        this.fs.copyTpl(this.templatePath('.pkgmeta'), this.destinationPath('.pkgmeta'), {
            appName: this.props.appName
        });

        // TOC
        this.fs.copyTpl(
            this.templatePath('addon.toc'),
            this.destinationPath(`${this.props.appName}.toc`),
            {
                wowVersion: this.props.wowVersion,
                appName: this.props.appName,
                appDesc: this.props.appDesc,
                appURL: this.props.appURL,
                appFeedback: this.props.appFeedback,
                authorName: this.props.authorName,
                authorEmail: this.props.authorEmail
            }
        );

        // CHANGELOG
        this.fs.copy(
            this.templatePath('CHANGELOG.md'),
            this.destinationPath('CHANGELOG.md')
        );

        // Constants
        this.fs.copy(
            this.templatePath('constants.lua'),
            this.destinationPath('constants.lua')
        );

        // Core
        this.fs.copyTpl(this.templatePath('core.lua'), this.destinationPath('core.lua'), {
            appName: this.props.appName,
            iconPath: this.props.iconPath,
            chatCmd: this.props.chatCmd
        });

        // Embeds
        this.fs.copy(this.templatePath('embeds.xml'), this.destinationPath('embeds.xml'));

        // README
        this.fs.copyTpl(
            this.templatePath('constants.lua'),
            this.destinationPath('constants.lua'),
            {
                appName: this.props.appName,
                appDesc: this.props.appDesc,
                appFeedback: this.props.appFeedback
            }
        );
    }

    end() {
        this.log(
            yosay(
                `${chalk.green('Addon created!')}\n\nThanks for using ${chalk.yellow.bold(
                    'generator-wow-addon'
                )}!`
            )
        );
    }
};
