import chalk from 'chalk';
import type {
  AngularConstruct,
  Component,
  Injectable,
  Directive,
  Method,
  Property,
  InputProperty,
  OutputProperty,
  Constructor,
} from '../types/compodoc.js';
import {
  isComponent,
  isInjectable,
  isDirective,
  isPipe,
  isModule,
} from '../types/compodoc.js';

/**
 * Formatter service for displaying search results and API details
 */
export class Formatter {
  /**
   * Format search results as a list
   */
  formatSearchResults(results: AngularConstruct[]): string {
    if (results.length === 0) {
      return chalk.yellow('No results found.');
    }

    const lines: string[] = [];

    for (const result of results) {
      // First line: [type] Name
      const type = this.formatTypeTag(result.type);
      const name = result.deprecated
        ? chalk.yellow.bold(`${result.name} (deprecated)`)
        : chalk.bold.white(result.name);

      lines.push(`${type} ${name}`);

      // Second line: file path
      const filePath = result.file.replace(/^\.\//, '');
      lines.push(chalk.dim(`  File: ${filePath}`));

      // Third line: selector (if available)
      const selector = this.getSelectorValue(result);
      if (selector) {
        lines.push(chalk.cyan(`  Selector: ${selector}`));
      }

      // Fourth line: description (if available)
      if (result.rawdescription) {
        const description = this.formatDescription(result.rawdescription);
        lines.push(chalk.gray(`  ${description}`));
      }

      // Empty line between results
      lines.push('');
    }

    return lines.join('\n');
  }

  /**
   * Format API details for a construct
   */
  formatApiDetails(construct: AngularConstruct): string {
    const sections: string[] = [];

    // Header
    sections.push(chalk.bold.green(construct.name));
    sections.push(chalk.gray(`File: ${construct.file}`));
    sections.push(chalk.gray(`Type: ${construct.type}`));

    if (construct.deprecated) {
      sections.push(
        chalk.yellow(
          `⚠️  Deprecated${construct.deprecationMessage ? `: ${construct.deprecationMessage}` : ''}`
        )
      );
    }

    if (construct.rawdescription) {
      sections.push('');
      sections.push(chalk.white(construct.rawdescription.trim()));
    }

    // Type-specific sections
    if (isComponent(construct)) {
      sections.push(...this.formatComponentDetails(construct));
    } else if (isInjectable(construct)) {
      sections.push(...this.formatInjectableDetails(construct));
    } else if (isDirective(construct)) {
      sections.push(...this.formatDirectiveDetails(construct));
    } else if (isPipe(construct)) {
      sections.push(...this.formatPipeDetails(construct));
    } else if (isModule(construct)) {
      sections.push(...this.formatModuleDetails(construct));
    }

    return sections.join('\n');
  }

  /**
   * Format component-specific details
   */
  private formatComponentDetails(component: Component): string[] {
    const sections: string[] = [];

    if (component.selector) {
      sections.push('');
      sections.push(chalk.cyan('Selector:'));
      sections.push(`  ${component.selector}`);
    }

    sections.push('');
    sections.push(
      chalk.cyan('Standalone:'),
      component.standalone ? chalk.green('Yes') : chalk.gray('No')
    );

    if (component.inputsClass && component.inputsClass.length > 0) {
      sections.push('');
      sections.push(chalk.cyan('Inputs:'));
      sections.push(this.formatInputs(component.inputsClass));
    }

    if (component.outputsClass && component.outputsClass.length > 0) {
      sections.push('');
      sections.push(chalk.cyan('Outputs:'));
      sections.push(this.formatOutputs(component.outputsClass));
    }

    if (component.propertiesClass && component.propertiesClass.length > 0) {
      sections.push('');
      sections.push(chalk.cyan('Properties:'));
      sections.push(this.formatProperties(component.propertiesClass));
    }

    if (component.methodsClass && component.methodsClass.length > 0) {
      sections.push('');
      sections.push(chalk.cyan('Methods:'));
      sections.push(this.formatMethods(component.methodsClass));
    }

    if (component.constructorObj) {
      sections.push('');
      sections.push(chalk.cyan('Constructor:'));
      sections.push(this.formatConstructor(component.constructorObj));
    }

    return sections;
  }

  /**
   * Format injectable (service) details
   */
  private formatInjectableDetails(injectable: Injectable): string[] {
    const sections: string[] = [];

    if (injectable.properties && injectable.properties.length > 0) {
      sections.push('');
      sections.push(chalk.cyan('Properties:'));
      sections.push(this.formatProperties(injectable.properties));
    }

    if (injectable.methods && injectable.methods.length > 0) {
      sections.push('');
      sections.push(chalk.cyan('Methods:'));
      sections.push(this.formatMethods(injectable.methods));
    }

    if (injectable.constructorObj) {
      sections.push('');
      sections.push(chalk.cyan('Constructor Dependencies:'));
      sections.push(this.formatConstructor(injectable.constructorObj));
    }

    return sections;
  }

  /**
   * Format directive details
   */
  private formatDirectiveDetails(directive: Directive): string[] {
    const sections: string[] = [];

    if (directive.selector) {
      sections.push('');
      sections.push(chalk.cyan('Selector:'));
      sections.push(`  ${directive.selector}`);
    }

    sections.push('');
    sections.push(
      chalk.cyan('Standalone:'),
      directive.standalone ? chalk.green('Yes') : chalk.gray('No')
    );

    if (directive.inputsClass && directive.inputsClass.length > 0) {
      sections.push('');
      sections.push(chalk.cyan('Inputs:'));
      sections.push(this.formatInputs(directive.inputsClass));
    }

    if (directive.outputsClass && directive.outputsClass.length > 0) {
      sections.push('');
      sections.push(chalk.cyan('Outputs:'));
      sections.push(this.formatOutputs(directive.outputsClass));
    }

    if (directive.methodsClass && directive.methodsClass.length > 0) {
      sections.push('');
      sections.push(chalk.cyan('Methods:'));
      sections.push(this.formatMethods(directive.methodsClass));
    }

    return sections;
  }

  /**
   * Format pipe details
   */
  private formatPipeDetails(pipe: any): string[] {
    const sections: string[] = [];

    if (pipe.pipeName) {
      sections.push('');
      sections.push(chalk.cyan('Pipe Name:'));
      sections.push(`  ${pipe.pipeName}`);
    }

    sections.push('');
    sections.push(
      chalk.cyan('Pure:'),
      pipe.pure !== false ? chalk.green('Yes') : chalk.gray('No')
    );

    return sections;
  }

  /**
   * Format module details
   */
  private formatModuleDetails(module: any): string[] {
    const sections: string[] = [];

    if (module.declarations && module.declarations.length > 0) {
      sections.push('');
      sections.push(chalk.cyan('Declarations:'));
      sections.push(
        module.declarations.map((d: any) => `  • ${d.name}`).join('\n')
      );
    }

    if (module.imports && module.imports.length > 0) {
      sections.push('');
      sections.push(chalk.cyan('Imports:'));
      sections.push(module.imports.map((i: any) => `  • ${i.name}`).join('\n'));
    }

    if (module.exports && module.exports.length > 0) {
      sections.push('');
      sections.push(chalk.cyan('Exports:'));
      sections.push(module.exports.map((e: any) => `  • ${e.name}`).join('\n'));
    }

    return sections;
  }

  /**
   * Format inputs
   */
  private formatInputs(inputs: InputProperty[]): string {
    return inputs
      .map((input) => {
        const deprecated = input.deprecated ? chalk.yellow(' (deprecated)') : '';
        const desc = input.rawdescription ? `\n    ${chalk.gray(input.rawdescription.trim())}` : '';
        return `  • ${chalk.green(input.name)}: ${chalk.gray(input.type)}${deprecated}${desc}`;
      })
      .join('\n');
  }

  /**
   * Format outputs
   */
  private formatOutputs(outputs: OutputProperty[]): string {
    return outputs
      .map((output) => {
        const deprecated = output.deprecated ? chalk.yellow(' (deprecated)') : '';
        const desc = output.rawdescription ? `\n    ${chalk.gray(output.rawdescription.trim())}` : '';
        return `  • ${chalk.green(output.name)}: ${chalk.gray(output.type)}${deprecated}${desc}`;
      })
      .join('\n');
  }

  /**
   * Format properties
   */
  private formatProperties(properties: Property[]): string {
    return properties
      .map((prop) => {
        const deprecated = prop.deprecated ? chalk.yellow(' (deprecated)') : '';
        const defaultVal = prop.defaultValue ? ` = ${prop.defaultValue}` : '';
        const desc = prop.rawdescription ? `\n    ${chalk.gray(prop.rawdescription.trim())}` : '';
        return `  • ${chalk.green(prop.name)}: ${chalk.gray(prop.type)}${defaultVal}${deprecated}${desc}`;
      })
      .join('\n');
  }

  /**
   * Format methods
   */
  private formatMethods(methods: Method[]): string {
    return methods
      .map((method) => {
        const args =
          method.args?.map((arg) => `${arg.name}: ${arg.type}`).join(', ') || '';
        const returnType = method.returnType || 'void';
        const deprecated = method.deprecated ? chalk.yellow(' (deprecated)') : '';
        const desc = method.rawdescription ? `\n    ${chalk.gray(method.rawdescription.trim())}` : '';
        return `  • ${chalk.green(method.name)}(${args}): ${chalk.gray(returnType)}${deprecated}${desc}`;
      })
      .join('\n');
  }

  /**
   * Format constructor
   */
  private formatConstructor(constructor: Constructor): string {
    if (!constructor.args || constructor.args.length === 0) {
      return chalk.gray('  No dependencies');
    }

    return constructor.args
      .map(
        (arg) =>
          `  • ${chalk.green(arg.name)}: ${chalk.gray(arg.type)}`
      )
      .join('\n');
  }

  /**
   * Get selector or pipe name value (unformatted)
   */
  private getSelectorValue(construct: AngularConstruct): string {
    if (isComponent(construct) || isDirective(construct)) {
      return construct.selector || '';
    }
    if (isPipe(construct)) {
      return (construct as any).pipeName || '';
    }
    return '';
  }

  /**
   * Format construct type as a tag [type]
   */
  private formatTypeTag(type: string): string {
    const colors: Record<string, (text: string) => string> = {
      component: chalk.blue,
      injectable: chalk.magenta,
      directive: chalk.cyan,
      pipe: chalk.yellow,
      module: chalk.green,
      class: chalk.white,
    };

    const color = colors[type] || chalk.white;
    return color(`[${type}]`);
  }

  /**
   * Format description for list display
   */
  private formatDescription(description: string): string {
    // Take first 2 lines or 200 characters, whichever is shorter
    const lines = description.split('\n').filter(line => line.trim());
    const firstLines = lines.slice(0, 2).join(' ');

    if (firstLines.length > 200) {
      return firstLines.substring(0, 197) + '...';
    }

    return firstLines;
  }
}
