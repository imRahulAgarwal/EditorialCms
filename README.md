# Editorial CMS

## Overview

A project developed using **Next.Js + TypeScript + Tailwind CSS**.
This project possess the following features:

-   Server Side **(RBAC - Role Based Access System)**
-   **WYSIWYG** Editor
-   **Draft / Archived / Publish** Publish Status
-   CI with **GitHub Actions** and Automatic deployment to **Vercel**

---

## Tech Stack

-   **Next.js (App Router)**
-   **TypeScript**
-   **Node.js**
-   **Joi** (Data validation)
-   **GitHub Actions** (CI)
-   **Vercel** (deployment)
-   **Tailwind CSS**

---

## Roles & Permissions

### Roles

| Role        | Capabilities                                |
| ----------- | ------------------------------------------- |
| Viewer      | View published pages only                   |
| Editor      | Create/edit drafts, preview content         |
| Admin       | Publish/unpublish content, manage editors   |
| Super Admin | Full access, role assignment, system config |

### RBAC Enforcement

-   **Server-only authorization**
-   No client-side trust

---

## Content Lifecycle

```

Draft → Preview → Published → Archived

```

-   **Draft**
    -   Editable
    -   Visible only to Editor
-   **Preview**
    -   Read-only snapshot
-   **Published**
    -   Publicly accessible
    -   Immutable until reverted to draft

State transitions are enforced server-side.

---

## WYSIWYG Builder (TipTap)

-   Block-based editor
-   Supported blocks:
    -   Text
    -   Heading
-   Sanitized on Server, before saving to database

---

## Architecture

## Commit Convention

```

feat: add editor draft workflow
fix: enforce admin-only publish
test: add permission matrix tests
refactor: extract RBAC service
docs: update README

```

---

## Environment Variables

```

MONGO_URL=
JWT_SECRET=
DEFAULT_PASSWORD=
NEXTAUTH_URL=
VERCEL_PROJECT_ID=
VERCEL_TOKEN=

```

---

## Local Development

```bash
npm install
npm run dev
```

---

## Security Notes

-   No permission logic on client
-   No trust in request payloads
-   Joi validation on all inputs
