use super::operators::Operator;

#[derive(Clone)]
pub enum ExprKind {
    Literal(String),
    Pattern(String),
    StartCapture,
    EndCapture,
    StartGroup,
    EndGroup,
    Empty,
}

#[derive(Clone)]
pub struct Expr {
    pub kind: ExprKind,
    pub op: Operator,
    pub quantifier: Option<String>,
}

impl Expr {
    pub fn add_quantifier(&mut self, quantifier: String) {
        self.quantifier = Some(quantifier);
    }

    pub fn to_regex(&self) -> String {
        let base = match &self.kind {
            ExprKind::Literal(text) => text.clone(),
            ExprKind::Pattern(pattern) => pattern.clone(),
            ExprKind::StartCapture => "(".to_string(),
            ExprKind::EndCapture => ")".to_string(),
            ExprKind::StartGroup => "(?:".to_string(),
            ExprKind::EndGroup => ")".to_string(),
            ExprKind::Empty => "".to_string(),
        };

        if let Some(quant) = &self.quantifier {
            format!("{}{}", base, quant)
        } else {
            base
        }
    }
}