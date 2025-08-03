#!/bin/bash

# Number of concurrent requests
CONCURRENCY=5

# Request payload
read -r -d '' PAYLOAD <<EOF
{
  "userId": "688642663d6b136514b65a3d",
  "showtimeId": "6886927b8d5a767035ef61dc",
  "seatIds": [
    "68868d54cdbf81b2d485588b", "68868d54cdbf81b2d4855895", "68868d54cdbf81b2d48558a0"
  ]
}
EOF

# Function to perform a curl request
make_request() {
  curl -s -o /dev/null -w "%{http_code} - Request %s\n" \
    -X POST 'http://localhost:3002/api/v1/bookings' \
    -H 'accept: */*' \
    -H 'Content-Type: application/json' \
    -d "$PAYLOAD"
}

# Export the function and payload
export -f make_request
export PAYLOAD

# Trigger concurrent requests
seq 1 10 | xargs -n 1 -P "$CONCURRENCY" bash -c 'make_request "$@"' _
