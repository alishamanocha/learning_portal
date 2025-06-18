"use client";

import React from "react";

export default function Assignment({ asgnName }: { asgnName: string }) {
    return (<div>
    <h1>{asgnName}</h1>
    <p>What is 30% of 40?</p>
    </div>
    )
}