import { FormatterOptionsArgs, Row, writeToStream } from '@fast-csv/format'
import type { CsvFileOpts, ITaskName, ITypeExport } from '@preload/types'
import { createWriteStream, readFile } from 'fs'
import path from 'path'
import { optionHeaderCsvFile, optionHeaderRowCsvFile } from '../helper'

export class CsvFile {
  public readonly path: string
  private readonly headers: string[]
  private readonly writeOpts: FormatterOptionsArgs<Row, Row>

  constructor(opts: CsvFileOpts) {
    this.headers = opts.headers
    this.path = opts.path
    this.writeOpts = {
      headers: this.headers,
      includeEndRowDelimiter: true,
      writeBOM: true,
      delimiter: opts.delimiter || '|'
    }
  }

  static write(
    stream: NodeJS.WritableStream,
    rows: Row[],
    options: FormatterOptionsArgs<Row, Row>
  ): Promise<void> {
    return new Promise((res, rej) => {
      writeToStream(stream, rows, options)
        .on('error', (err: Error) => rej(err))
        .on('finish', () => res())
    })
  }

  create(rows: Row[]): Promise<void> {
    return CsvFile.write(createWriteStream(this.path), rows, {
      ...this.writeOpts
    })
  }

  append(rows: Row[]): Promise<void> {
    return CsvFile.write(createWriteStream(this.path, { flags: 'a' }), rows, {
      ...this.writeOpts,
      writeHeaders: false
    } as FormatterOptionsArgs<Row, Row>)
  }

  read(): Promise<Buffer> {
    return new Promise((res, rej) => {
      readFile(this.path, (err, contents) => {
        if (err) {
          return rej(err)
        }
        return res(contents)
      })
    })
  }
}

export const makeCsvFile = async (
  payload: ITaskName | 'accounts_export' | 'post_export' | 'g_map_export',
  exportFilePath: string
): Promise<{ csvFile: CsvFile; headerRow: Row[] }> => {
  let header: string[]
  let headerRow: Row[]
  switch (payload) {
    default:
      header = optionHeaderCsvFile
      headerRow = optionHeaderRowCsvFile
      break
  }
  const csvFile = new CsvFile({
    path: exportFilePath,
    headers: header
  })

  return { csvFile, headerRow }
}

export const createCsvFile = async (
  payload: ITypeExport,
  exportFilePath: string
): Promise<CsvFile> => {
  const { csvFile, headerRow } = await makeCsvFile(payload, exportFilePath)
  await csvFile.append(headerRow)
  return csvFile
}

export const getExportFilePath = (dir: string, name: string, ext: string): string => {
  return path.join(dir, `${name}.${ext}`)
}
