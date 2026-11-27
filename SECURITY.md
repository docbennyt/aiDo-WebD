# Security and privacy

Report suspected vulnerabilities privately through GitHub's repository security advisory reporting if enabled; otherwise contact the maintainer through their GitHub profile without publishing sensitive reproduction details. Do not open public issues containing credentials or exploitable private data.

WebD trusts the user to select authorized pages and explicitly approve shared evidence. Page data is untrusted; it must not become agent instructions. The extension does not access arbitrary filesystem data, inject remote code, send network requests, or access model accounts. The only persistent boundary is the browser's granted tab access. Temporary overlay state is isolated from webpage scripts except for the shared DOM; page scripts may still interfere. Review paths, classes, selectors and custom CSS values before sharing. Native clipboard contents are under the user's control.
