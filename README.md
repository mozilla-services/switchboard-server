![travis-ci status](https://travis-ci.org/mozilla-services/switchboard-server.svg?branch=master)

Switchboard is a stateless service that allows clients be divided into A/B testing groups based on UUIDs. Clients send GET requests to the server with their UUID as well as other information that can be useful for classification and user group segmentation. The server determines whether the client matches a set of specifications in the JSON experiments file, and sends back a JSON reply that indicates which experiments the client should enable.

Switchboard makes enabling features easy - once you have conditional logic in your client application you can simply toggle them on or off in Switchboard.
