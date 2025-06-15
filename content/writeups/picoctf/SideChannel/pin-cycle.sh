#!/bin/bash

while true; do
    # Generate 8-digit number with leading zeros
    number=$(printf "%08d\n" $((RANDOM % 100000000)))

    # Run digit_checker program with the generated number
    result=$(./digit_checker "$number")

    # Check if the result is "Access denied."
    if [ "$result" != "Access denied." ]; then
        echo "Access granted for number: $number"
        break
    else
        echo "Access denied for number: $number"
    fi
done
