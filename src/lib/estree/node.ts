import type * as Estree from 'estree'

export type {
  ArrayExpression,
  ArrayPattern,
  ArrowFunctionExpression,
  AssignmentExpression,
  AssignmentPattern,
  AssignmentProperty,
  AwaitExpression,
  BaseCallExpression,
  BaseClass,
  BaseDeclaration,
  BaseExpression,
  BaseForXStatement,
  BaseFunction,
  BaseModuleDeclaration,
  BaseModuleSpecifier,
  BaseNode,
  BaseNodeWithoutComments,
  BasePattern,
  BaseStatement,
  BigIntLiteral,
  BinaryExpression,
  BlockStatement,
  BreakStatement,
  CatchClause,
  ChainExpression,
  ClassBody,
  ClassDeclaration,
  ClassExpression,
  Comment,
  ConditionalExpression,
  ContinueStatement,
  DebuggerStatement,
  Decorator,
  Directive,
  DoWhileStatement,
  EmptyStatement,
  ExportAllDeclaration,
  ExportDefaultDeclaration,
  ExportNamedDeclaration,
  ExportSpecifier,
  ExpressionMap,
  ExpressionStatement,
  ForInStatement,
  ForOfStatement,
  ForStatement,
  FunctionDeclaration,
  FunctionExpression,
  Identifier,
  IfStatement,
  ImportAttribute,
  ImportDeclaration,
  ImportDefaultSpecifier,
  ImportExpression,
  ImportNamespaceSpecifier,
  ImportSpecifier,
  LabeledStatement,
  LogicalExpression,
  MaybeNamedClassDeclaration,
  MaybeNamedFunctionDeclaration,
  MemberExpression,
  MetaProperty,
  MethodDefinition,
  NewExpression,
} from 'estree'

export namespace Groups {
  export type Any = Estree.Node
}

export const is = <EstreeNode extends Estree.BaseNode>(type: EstreeNode[`type`]) => (node: any): node is EstreeNode => {
  // eslint-disable-next-line
  return typeof node === `object` && node && node.type === type
}

export const isIfStatement = is<Estree.IfStatement>(`IfStatement`)
export const isBlockStatement = is<Estree.BlockStatement>(`BlockStatement`)
export const isIdentifier = is<Estree.Identifier>(`Identifier`)
export const isMemberExpression = is<Estree.MemberExpression>(`MemberExpression`)
export const isUnaryExpression = is<Estree.UnaryExpression>(`UnaryExpression`)
