/**
 * TypeScript type definitions for Compodoc's documentation.json format
 */

export interface JsDocTag {
  name?: string;
  type?: string;
  tagName: { text: string };
  comment?: string;
}

export interface MethodArg {
  name: string;
  type: string;
  deprecated: boolean;
}

export interface ConstructorArg {
  name: string;
  type: string;
  deprecated: boolean;
}

export interface Constructor {
  name: 'constructor';
  args?: ConstructorArg[];
  line?: number;
  description?: string;
  jsdoctags?: JsDocTag[];
}

export interface Method {
  name: string;
  args?: MethodArg[];
  returnType?: string;
  line: number;
  deprecated: boolean;
  deprecationMessage?: string;
  description?: string;
  rawdescription?: string;
  jsdoctags?: JsDocTag[];
  modifierKind?: number[];
}

export interface Property {
  name: string;
  type: string;
  defaultValue?: string;
  line: number;
  deprecated: boolean;
  deprecationMessage?: string;
  description?: string;
  rawdescription?: string;
  modifierKind?: number[];
  decorators?: Array<{ name: string }>;
}

export interface InputProperty {
  name: string;
  type: string;
  line: number;
  deprecated: boolean;
  deprecationMessage?: string;
  description?: string;
  rawdescription?: string;
  decorators?: Array<{ name: string }>;
}

export interface OutputProperty {
  name: string;
  type: string;
  line: number;
  deprecated: boolean;
  deprecationMessage?: string;
  description?: string;
  rawdescription?: string;
  decorators?: Array<{ name: string }>;
}

export interface Component {
  name: string;
  id: string;
  file: string;
  type: 'component';
  selector?: string;
  standalone: boolean;
  deprecated: boolean;
  deprecationMessage?: string;
  description?: string;
  rawdescription?: string;
  sourceCode?: string;

  // Component-specific
  templateUrl?: string[];
  styleUrls?: string[];
  template?: string;
  encapsulation?: string[];
  changeDetection?: string;

  // Class members
  inputsClass?: InputProperty[];
  outputsClass?: OutputProperty[];
  methodsClass?: Method[];
  propertiesClass?: Property[];
  constructorObj?: Constructor;

  // Metadata
  implements?: string[];
  extends?: string;
  providers?: Array<{ name: string }>;
  imports?: Array<{ name: string }>;
}

export interface Injectable {
  name: string;
  id: string;
  file: string;
  type: 'injectable';
  deprecated: boolean;
  deprecationMessage?: string;
  description?: string;
  rawdescription?: string;
  sourceCode?: string;

  // Class members
  properties?: Property[];
  methods?: Method[];
  constructorObj?: Constructor;

  // Metadata
  implements?: string[];
  extends?: string;
}

export interface Directive {
  name: string;
  id: string;
  file: string;
  type: 'directive';
  selector?: string;
  standalone: boolean;
  deprecated: boolean;
  deprecationMessage?: string;
  description?: string;
  rawdescription?: string;
  sourceCode?: string;

  // Class members
  inputsClass?: InputProperty[];
  outputsClass?: OutputProperty[];
  methodsClass?: Method[];
  propertiesClass?: Property[];
  constructorObj?: Constructor;

  // Metadata
  implements?: string[];
  extends?: string;
  providers?: Array<{ name: string }>;
}

export interface Pipe {
  name: string;
  id: string;
  file: string;
  type: 'pipe';
  standalone: boolean;
  deprecated: boolean;
  deprecationMessage?: string;
  description?: string;
  rawdescription?: string;
  sourceCode?: string;

  // Pipe-specific
  pipeName?: string;
  pure?: boolean;

  // Class members
  methods?: Method[];
  properties?: Property[];
}

export interface Module {
  name: string;
  id: string;
  file: string;
  type: 'module';
  deprecated: boolean;
  deprecationMessage?: string;
  description?: string;
  rawdescription?: string;
  sourceCode?: string;

  // Module metadata
  declarations?: Array<{ name: string }>;
  imports?: Array<{ name: string }>;
  exports?: Array<{ name: string }>;
  providers?: Array<{ name: string }>;
  bootstrap?: Array<{ name: string }>;
}

export interface Class {
  name: string;
  id: string;
  file: string;
  type: 'class';
  deprecated: boolean;
  deprecationMessage?: string;
  description?: string;
  rawdescription?: string;
  sourceCode?: string;

  // Class members
  methods?: Method[];
  properties?: Property[];
  constructorObj?: Constructor;

  // Metadata
  implements?: string[];
  extends?: string;
}

export interface Interface {
  name: string;
  id: string;
  file: string;
  type: 'interface';
  deprecated: boolean;
  deprecationMessage?: string;
  description?: string;
  sourceCode?: string;

  // Interface members
  properties?: Property[];
  methods?: Method[];
}

export interface Miscellaneous {
  variables?: Array<{ name: string; type: string; file: string }>;
  functions?: Array<{ name: string; file: string }>;
  typealiases?: Array<{ name: string; type: string; file: string }>;
  enumerations?: Array<{ name: string; file: string }>;
}

export interface Coverage {
  count: number;
  status: string;
  files: Array<{
    filePath: string;
    type: string;
    linktype: string;
    name: string;
    coveragePercent: number;
    coverageCount: string;
    status: string;
  }>;
}

export interface CompodocData {
  pipes?: Pipe[];
  interfaces?: Interface[];
  injectables?: Injectable[];
  classes?: Class[];
  directives?: Directive[];
  components?: Component[];
  modules?: Module[];
  miscellaneous?: Miscellaneous;
  routes?: unknown[];
  coverage?: Coverage;
}

/**
 * Union type for all searchable Angular constructs
 */
export type AngularConstruct = Component | Injectable | Directive | Pipe | Module | Class;

/**
 * Type guard to check if a construct is a Component
 */
export function isComponent(construct: AngularConstruct): construct is Component {
  return construct.type === 'component';
}

/**
 * Type guard to check if a construct is an Injectable
 */
export function isInjectable(construct: AngularConstruct): construct is Injectable {
  return construct.type === 'injectable';
}

/**
 * Type guard to check if a construct is a Directive
 */
export function isDirective(construct: AngularConstruct): construct is Directive {
  return construct.type === 'directive';
}

/**
 * Type guard to check if a construct is a Pipe
 */
export function isPipe(construct: AngularConstruct): construct is Pipe {
  return construct.type === 'pipe';
}

/**
 * Type guard to check if a construct is a Module
 */
export function isModule(construct: AngularConstruct): construct is Module {
  return construct.type === 'module';
}

/**
 * Type guard to check if a construct is a Class
 */
export function isClass(construct: AngularConstruct): construct is Class {
  return construct.type === 'class';
}
