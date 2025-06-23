"use client";

import React, { useEffect, useState } from "react";

export default function Course({ courseName }: { courseName: string }) {
    return (
        <div>
            <h1>{courseName}</h1>
        </div>
    );
}