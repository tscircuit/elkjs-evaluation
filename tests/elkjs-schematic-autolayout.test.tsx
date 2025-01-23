import { test, expect } from "bun:test"
import { getTestFixture } from "./fixtures/get-test-fixture"
import { convertCircuitJsonToSchematicSvg } from "circuit-to-svg"
import { layoutSchematicWithElk } from "../lib/SchWithElkjs"

test("elkjs schematic autolayout", async () => {
  const { circuit } = getTestFixture()

  circuit.add(
    <board width="20mm" height="20mm" schAutoLayoutEnabled>
      <chip name="U1" footprint="soic8" pcbX={5} pcbY={0} />
      <chip name="U2" footprint="tssop12" pcbX={5} pcbY={0} />
      <chip name="U2.5" footprint="tssop12" pcbX={5} pcbY={0} />
      <chip name="U3.5" footprint="sot23" pcbX={5} pcbY={0} />
      <resistor
        name="R1"
        pcbX={-5}
        pcbY={0}
        resistance={100}
        footprint="0402"
        schRotation={90}
      />
      <resistor
        name="R2"
        pcbX={-5}
        pcbY={0}
        resistance={100}
        footprint="0402"
      />
      <group>
        <chip name="U3" footprint="sot23" pcbX={5} pcbY={0} />
        <resistor
          name="R3"
          pcbX={-5}
          pcbY={0}
          schRotation={90}
          resistance={100}
          footprint="0402"
        />
      </group>

      <resistor
        name="R4"
        pcbX={-4}
        pcbY={0}
        resistance={100}
        footprint="0402"
      />
    </board>,
  )
  await circuit.renderUntilSettled()
  await layoutSchematicWithElk(circuit.db)
  expect(
    // @ts-ignore
    convertCircuitJsonToSchematicSvg(circuit.getCircuitJson(), {
      grid: {
        cellSize: 1,
        labelCells: true,
      },
    }),
  ).toMatchSvgSnapshot(import.meta.path)
})
