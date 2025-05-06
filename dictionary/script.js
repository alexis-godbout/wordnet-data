#!/usr/bin/env node

// Dependencies
import { get } from 'node:https';
import { extract } from 'tar';
import { chmod, mkdir, open, readdir, writeFile } from 'node:fs/promises';

// Variables
const DOWNLOAD_URL = 'https://wordnetcode.princeton.edu/wn3.1.dict.tar.gz';
const FILES_TO_EXTRACT = ['dict/data.adj', 'dict/data.noun'];
const OUTPUT_DIRECTORY = 'wordnet';

// Functions
function downloadAndExtractTarGz(url, fileList, outputDirectory) {
    return new Promise((resolve, reject) => {
        get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(`Failed to download file. Status code: ${response.statusCode}`);
            }
            else {
                const tarExtractor = extract(
                    {
                        cwd: outputDirectory,
                        strip: 1
                    },
                    fileList
                );
                response.pipe(tarExtractor);
                response.on('error', (errorMsg) => {
                    reject(
                        console.error(`Error during download: ${errorMsg}`)
                    );
                })
                tarExtractor.on('error', (errorMsg) => {
                    reject(
                        console.error(`Error during extraction: ${errorMsg}`)
                    );
                })
                tarExtractor.on('finish', () => {
                    resolve(
                        console.log(`Successfully downloaded and extracted ${url.split('/').pop()} to ${outputDirectory}`)
                    );
                })
            }
        });
    })
}

async function trimWordnetDataFile(file) {
    let newLines = [];
    const regexLicense = /^\s{2}.*$/;
    await chmod(file, '600');
    const fileHandle = await open(file);
    for await (const line of fileHandle.readLines()) {
        if (regexLicense.test(line)) {
            newLines.push(`${line}\n`);
        }
        else {
            newLines.push(`${line.split(' ')[4]} | ${line.split('| ').pop().trim()}\n`);
        }
    }
    await writeFile(file, newLines);
}

async function main() {
    await mkdir(OUTPUT_DIRECTORY, { recursive: true });
    await downloadAndExtractTarGz(DOWNLOAD_URL, FILES_TO_EXTRACT, OUTPUT_DIRECTORY);
    for (const file of await readdir(OUTPUT_DIRECTORY)) {
        trimWordnetDataFile(`${OUTPUT_DIRECTORY}/${file}`)
    }
}

// Script

main();