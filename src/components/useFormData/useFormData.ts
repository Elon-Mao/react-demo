import { useEffect } from 'react'
import { produce } from 'immer'
import { Updater, useImmer } from 'use-immer'

const combineObj = (baseObj: object, updateObj: object) => {
  if (baseObj === updateObj) {
    return baseObj
  }

  const baseKeys = Object.keys(baseObj)
  const updateKeys = Object.keys(updateObj)
  let allChildrenEqual = baseKeys.length === updateKeys.length
  const newObj = produce(updateObj, (draft) => {
    for (const updateKey of updateKeys) {
      const key = updateKey as keyof object
      const baseValue = baseObj[key]
      const updateValue = updateObj[key]
      let newValue = updateValue
      if (typeof baseValue === 'object' && typeof updateValue === 'object') {
        newValue = combineObj(baseValue, updateValue) as never
      }
      if (newValue !== baseValue) {
        allChildrenEqual = false
      }
      draft[key] = newValue
    }
  })
  return allChildrenEqual ? baseObj : newObj
}

export default function useFormData<S = object>(initData: S): [S, Updater<S>] {
  const [formData, updateFormData] = useImmer(initData)

  useEffect(() => {
    updateFormData(initData)
  }, [initData, updateFormData])

  return [combineObj(initData as object, formData as object) as S, updateFormData]
}