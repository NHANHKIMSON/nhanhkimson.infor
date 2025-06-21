"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link";

export function DownloadCv(){
    return (
        <>
            <Link href={'/pdf/nhanhkimson_resume.pdf'}>
                <Button>
                    Download CV
                </Button>
            </Link>
        </>
    )
}