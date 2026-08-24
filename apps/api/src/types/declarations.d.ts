declare module 'express' {
  export interface Request {
    body: any;
    query: Record<string, any>;
    params: Record<string, any>;
    headers: Record<string, any>;
    [key: string]: any;
  }

  export interface Response {
    status(code: number): this;
    json(data: any): this;
    send(data: any): this;
    setHeader(name: string, value: string): this;
    [key: string]: any;
  }

  export type NextFunction = (err?: any) => void;

  export interface Router {
    get(path: string, ...handlers: Array<(req: Request, res: Response, next?: NextFunction) => any>): this;
    post(path: string, ...handlers: Array<(req: Request, res: Response, next?: NextFunction) => any>): this;
    put(path: string, ...handlers: Array<(req: Request, res: Response, next?: NextFunction) => any>): this;
    delete(path: string, ...handlers: Array<(req: Request, res: Response, next?: NextFunction) => any>): this;
    use(...args: any[]): this;
    [key: string]: any;
  }

  export const Router: () => Router;

  export interface Express {
    use(...args: any[]): this;
    get(path: string, handler: (req: Request, res: Response) => any): this;
    post(path: string, handler: (req: Request, res: Response) => any): this;
    listen(port: number | string, callback?: () => void): any;
    [key: string]: any;
  }

  const express: {
    (): Express;
    Router(): Router;
    json(options?: any): any;
    urlencoded(options?: any): any;
    static(root: string, options?: any): any;
  };

  export default express;
}

declare module 'cors' {
  export default function cors(options?: any): any;
}
