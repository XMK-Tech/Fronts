import React from 'react'

export function FormSteps(props: {children: React.ReactElement[]; selectedStep: number}) {
  return props.children[props.selectedStep]
}
