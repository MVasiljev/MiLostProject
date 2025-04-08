pub mod compression;

pub use compression::{
    Compression, CompressionOptions, CompressionResult, CompressionError,
    CompressionErrorKind, CompressionErrorDetails,
};