import { AST } from '@effect/schema';
import { IdentifierAnnotationId } from '@effect/schema/AST';
import { Annotated } from '@effect/schema/src/AST';

export type ComponentSchemaCallback =
  | ((id: string, ast: AST.AST) => void)
  | undefined;

export type Setter<T> = <A extends T>(
  a: A,
  componentSchemaCallback: ComponentSchemaCallback
) => A;

export const runSetters = <A>(
  a: A,
  setters: Setter<A>[],
  componentSchemaCallback: ComponentSchemaCallback = undefined
) => {
  for (const setter of setters) {
    a = setter(a, componentSchemaCallback);
  }
  return a;
};

export const removeAnnotation =
  (key: symbol) =>
  (ast: AST.AST & Annotated): AST.AST => {
    if (Object.prototype.hasOwnProperty.call(ast.annotations, key)) {
      const { [key]: _, ...rest } = ast.annotations;
      return {
        ...ast,
        annotations: rest,
      };
    }
    return ast;
  };

export const removeIdentifierAnnotation = removeAnnotation(
  IdentifierAnnotationId
);
