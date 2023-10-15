import { SandpackProps } from '@codesandbox/sandpack-react'

export default interface MenuItem extends SandpackProps {
  id: number
  menuName: string
}