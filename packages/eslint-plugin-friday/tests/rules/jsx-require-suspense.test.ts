import rule from "../../src/rules/jsx-require-suspense.js";
import { createRuleTester, fixtureCode } from "../setup.js";

const ruleTester = createRuleTester(true);

ruleTester.run("jsx-require-suspense", rule, {
  valid: [
    {
      name: "lazy component wrapped in Suspense",
      code: `
        const LazyComponent = lazy(() => import("./Component"));
        <Suspense fallback={<Skeleton />}>
          <LazyComponent />
        </Suspense>
      `,
      filename: "Component.tsx",
    },
    {
      name: "React.lazy component wrapped in Suspense",
      code: `
        const AsyncComponent = React.lazy(() => import("./Component"));
        <Suspense fallback={<Loading />}>
          <AsyncComponent />
        </Suspense>
      `,
      filename: "Component.tsx",
    },
    {
      name: "lazy component nested inside Suspense",
      code: fixtureCode`
        const LazyModal = lazy(() => import("./Modal"));
        <Suspense fallback={null}>
          <div>
            <LazyModal />
          </div>
        </Suspense>
      `,
      filename: "Component.tsx",
    },
    {
      name: "regular components without Suspense",
      code: `
        <RegularComponent />
      `,
      filename: "Component.tsx",
    },
    {
      name: "non-lazy function components",
      code: `
        const Component = () => <div />;
        <Component />
      `,
      filename: "Component.tsx",
    },
    {
      name: "multiple lazy components in same Suspense",
      code: `
        const LazyA = lazy(() => import("./A"));
        const LazyB = lazy(() => import("./B"));
        <Suspense fallback={<div />}>
          <LazyA />
          <LazyB />
        </Suspense>
      `,
      filename: "Component.tsx",
    },
    {
      name: "non-jsx file is not checked",
      code: `const LazyComponent = lazy(() => import("./Component"));`,
      filename: "Component.ts",
    },
    {
      name: "member-expression jsx element name is ignored",
      code: `
        const LazyComponent = lazy(() => import("./Component"));
        <Namespace.LazyComponent />
      `,
      filename: "Component.tsx",
    },
  ],
  invalid: [
    {
      name: "lazy component without Suspense",
      code: `
        const AsyncComponent = lazy(() => import("./Component"));
        <AsyncComponent />
      `,
      filename: "Component.tsx",
      errors: [
        { messageId: "requireSuspense", data: { name: "AsyncComponent" } },
      ],
    },
    {
      name: "React.lazy component without Suspense",
      code: `
        const LazyModal = React.lazy(() => import("./Modal"));
        <LazyModal />
      `,
      filename: "Component.tsx",
      errors: [{ messageId: "requireSuspense", data: { name: "LazyModal" } }],
    },
    {
      name: "lazy component nested in non-Suspense element",
      code: `
        const LazyComponent = lazy(() => import("./Component"));
        <div>
          <LazyComponent />
        </div>
      `,
      filename: "Component.tsx",
      errors: [
        { messageId: "requireSuspense", data: { name: "LazyComponent" } },
      ],
    },
    {
      name: "multiple lazy components without Suspense",
      code: `
        const LazyA = lazy(() => import("./A"));
        const LazyB = lazy(() => import("./B"));
        <div>
          <LazyA />
          <LazyB />
        </div>
      `,
      filename: "Component.tsx",
      errors: [
        { messageId: "requireSuspense", data: { name: "LazyA" } },
        { messageId: "requireSuspense", data: { name: "LazyB" } },
      ],
    },
  ],
});
