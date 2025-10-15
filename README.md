Directory structure:
└── taro112233-qdengachecker/
    ├── README.md
    ├── components.json
    ├── eslint.config.mjs
    ├── next.config.ts
    ├── package.json
    ├── pnpm-lock.yaml
    ├── postcss.config.mjs
    ├── tsconfig.json
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── admin/
    │   │   └── page.tsx
    │   ├── api/
    │   │   ├── admin/
    │   │   │   ├── assessments/
    │   │   │   │   ├── route.ts
    │   │   │   │   └── bulk-delete/
    │   │   │   │       └── route.ts
    │   │   │   └── verify/
    │   │   │       └── route.ts
    │   │   └── assess/
    │   │       └── route.ts
    │   ├── assessment/
    │   │   ├── page.tsx
    │   │   └── result/
    │   │       └── page.tsx
    │   └── dashboard/
    │       └── page.tsx
    ├── components/
    │   ├── admin/
    │   │   └── AssessmentTable.tsx
    │   ├── assessment/
    │   │   ├── AssessmentForm.tsx
    │   │   ├── BirthDateStep.tsx
    │   │   ├── MedicalConditionsStep.tsx
    │   │   ├── ProvinceStep.tsx
    │   │   └── ResultDisplay.tsx
    │   └── ui/
    │       ├── accordion.tsx
    │       ├── alert-dialog.tsx
    │       ├── alert.tsx
    │       ├── aspect-ratio.tsx
    │       ├── avatar.tsx
    │       ├── badge.tsx
    │       ├── breadcrumb.tsx
    │       ├── button.tsx
    │       ├── card.tsx
    │       ├── carousel.tsx
    │       ├── chart.tsx
    │       ├── checkbox.tsx
    │       ├── collapsible.tsx
    │       ├── command.tsx
    │       ├── context-menu.tsx
    │       ├── dialog.tsx
    │       ├── drawer.tsx
    │       ├── dropdown-menu.tsx
    │       ├── ExcelExportButton.tsx
    │       ├── form.tsx
    │       ├── hover-card.tsx
    │       ├── input-otp.tsx
    │       ├── input.tsx
    │       ├── label.tsx
    │       ├── menubar.tsx
    │       ├── navigation-menu.tsx
    │       ├── pagination.tsx
    │       ├── popover.tsx
    │       ├── progress.tsx
    │       ├── radio-group.tsx
    │       ├── resizable.tsx
    │       ├── scroll-area.tsx
    │       ├── select.tsx
    │       ├── separator.tsx
    │       ├── sheet.tsx
    │       ├── sidebar.tsx
    │       ├── skeleton.tsx
    │       ├── slider.tsx
    │       ├── sonner.tsx
    │       ├── switch.tsx
    │       ├── table.tsx
    │       ├── tabs.tsx
    │       ├── textarea.tsx
    │       ├── toast.tsx
    │       ├── toaster.tsx
    │       ├── toggle-group.tsx
    │       ├── toggle.tsx
    │       └── tooltip.tsx
    ├── constants/
    │   ├── conditions.ts
    │   └── provinces.ts
    ├── hooks/
    │   └── use-mobile.ts
    ├── lib/
    │   ├── db.ts
    │   └── utils.ts
    ├── prisma/
    │   └── schema.prisma
    ├── public/
    ├── types/
    │   └── assessment.ts
    └── utils/
        └── eligibility.ts


DATABASE_URL="postgresql://neondb_owner:npg_DJPqe3Il4hRn@ep-red-smoke-adnhx5tn-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
ADMIN_ACCESS_CODE=123456