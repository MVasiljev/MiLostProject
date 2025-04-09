#[derive(Clone, Copy, PartialEq)]
pub enum Operator {
    And,
    Or,
    Not,
    XOr,
    Conditional,
    LookAhead,
    LookBehind,
    NegativeLookAhead,
    NegativeLookBehind,
}

pub enum LogicalCondition {
    Always,
    Never,
    Predicate(fn(&str) -> bool),
}

impl Operator {
    pub fn apply(&self, left: bool, right: bool) -> bool {
        match self {
            Operator::And => left && right,
            Operator::Or => left || right,
            Operator::Not => !left,
            Operator::XOr => left ^ right,
            Operator::Conditional => left && right,
            _ => false
        }
    }
}