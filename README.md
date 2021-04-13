# custom-actions-examples
This is a repository of custom action steps that work with Testim.io

Initially it includes custom action steps (JavaScript) that we have created for customers. The code can be copied from here and added to a custom step in a Testim test. 

[Generate Faked Data](https://github.com/testimio/custom-actions-examples/blob/main/Generate-Faked-Data) (faker.js) - Uses the faker.js library to create fake test data. 

[Link Checker](https://github.com/testimio/custom-actions-examples/blob/main/link-checker) (CLI) - Finds links at the given URL and validates that they are working. 

[Network Performance Checker](https://github.com/testimio/custom-actions-examples/blob/main/Network-performance-checker) - Validate that all network requests are completed under maxResponseTime milliseconds. 

[Network Performance Summary](https://github.com/testimio/custom-actions-examples/blob/main/network-performance-summary) - Creates a summary of network requests with min/max/avg duration and request size. 

[Network Validate Request](https://github.com/testimio/custom-actions-examples/blob/main/network-validate) - Validate that a network request returns the proper status and/or is not slower than maxDuration (ms).

[Popup Killer](https://github.com/testimio/custom-actions-examples/blob/main/popup-killer) - When you don't know when a popup modal will kill your test, use this to handle it.

[Redact data](https://github.com/testimio/custom-actions-examples/blob/main/Redact-data) - This custom step creates an overlay element to prevent screenshot capture of private data.

[Select Item/Option by Text/Value](https://github.com/testimio/custom-actions-examples/blob/main/select-by-text) - Select an item by value or text (select/option, ul/li. table/tr)

[Select Items/Options Order Validate](https://github.com/testimio/custom-actions-examples/blob/main/select-order-validate) - Validates that the items in a list are sorted properly.

[Set Text]() (Encrypted) - Takes encrypted data, decrypts it and sets the text of a target field and optionally redacts it.

[Validate Select Item/Option](https://github.com/testimio/custom-actions-examples/blob/main/validate-select-item) - Validate that an expected item is in selected.

[Validate Select Items/Options](https://github.com/testimio/custom-actions-examples/blob/main/validate-select-items) - Validate that expected items are in a list/select.

Validate Element Computed Style(s) - Validate a superset/subset of style for an element
